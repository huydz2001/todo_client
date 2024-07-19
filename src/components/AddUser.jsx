import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import SelectList from "./SelectList";
import { useMutation } from "@apollo/client";
import { ADD_USER_GROUP } from "../graphql/group";
import { toast } from "sonner";

const ROLES = ["Member"];

const AddUser = ({ open, setOpen, userData, gruopId }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const [role, setRole] = useState(ROLES[0]);

  const isLoading = false,
    isUpdating = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [addUserGroup, { loading, error }] = useMutation(ADD_USER_GROUP);

  const handleOnSubmit = async (prop) => {
    const res = await addUserGroup({
      variables: {
        groupId: gruopId,
        userName: prop.name,
      },
    });

    if (res.data.addUserGroup.errors.length > 0) {
      toast.error(res.data.addUserGroup.errors[0].message);
    } else {
      toast.success("Add user success");
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="User name"
              type="text"
              name="name"
              label="User name"
              className="w-full rounded"
              register={register("name", {
                required: "User name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            {/* <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            /> */}

            {/* <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              // disable={true}
              className="w-full rounded bg-slate-200"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            /> */}

            <SelectList
              label="Role"
              lists={ROLES}
              selected={role}
              setSelected={setRole}
            />
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
