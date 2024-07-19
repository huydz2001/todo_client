import { useMutation, useQuery } from "@apollo/client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import AddUser from "../components/AddUser";
import Button from "../components/Button";
import ConfirmatioDialog from "../components/Dialogs";
import Title from "../components/Title";
import { DEL_USER_GROUP, GET_GROUP } from "../graphql/group";
import { getInitials } from "../utils";
import { toast } from "sonner";

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelectd] = useState(null);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);

  const deleteHandler = async () => {
    const res = await delUserGroup({
      variables: {
        groupId: group.id,
        userName: selected,
      },
    });

    if (res?.deleteUserGroup?.errors.length > 0) {
      toast.error("Something went wrong!");
    } else {
      toast.success("Delete user success");
      setTimeout(() => {
        setOpenDialog(false);
      }, 1000);
    }
  };

  const { data, loading, error } = useQuery(GET_GROUP, {
    variables: {
      userId: user.id,
    },
  });

  const [delUserGroup, { loadingDel, errorDel }] = useMutation(DEL_USER_GROUP);

  useEffect(() => {
    setMembers(data?.getGroupByUser.members);
    setGroup(data?.getGroupByUser);
  }, [data]);

  const deleteClick = async (userName) => {
    setSelectd(userName);
    setOpenDialog(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className="p-2">{user.email || "user.emal.com"}</td>
      <td className="p-2">{user.status == 2 ? "Admin" : "Member"}</td>

      <td>
        <button
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            !user?.isDelete ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {!user?.isDelete ? "Active" : "Disabled"}
        </button>
      </td>

      {user?.status != 2 ? (
        <td className="p-2 flex gap-4 justify-center">
          <Button
            className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
            label="Delete"
            type="button"
            onClick={() => deleteClick(user?.name)}
          />
        </td>
      ) : (
        <></>
      )}
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="  Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {members?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        gruopId={data?.getGroupByUser.id}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Users;
