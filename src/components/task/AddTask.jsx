import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  formatDateInp,
  formatTime,
  STAUS_TASK,
  findStatusByValue,
  formatTimeStamp,
} from "../../utils";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";
import { useMutation, useQuery } from "@apollo/client";
import { GET_GROUP } from "../../graphql/group";
import { useSelector } from "react-redux";
import { CREATE_TASK } from "../../graphql/task";
import { toast } from "sonner";

const LISTS = ["TODO", "DOING", "COMPLETED"];

const AddTask = ({ open, setOpen, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(
    findStatusByValue(task?.status)?.toUpperCase() || LISTS[0]
  );
  const { user } = useSelector((state) => state.auth);
  const [member, setMember] = useState();
  const [defaultUid, setDefaultUid] = useState();
  const [item, setItem] = useState(() => {
    if (task) {
      return {
        id: task?.id,
        createBy: user.id,
        name: task.name,
        start_time: formatTime(new Date(task.start_time)),
        end_time: formatTime(new Date(task.end_time)),
        status: task?.status,
        start_date: task.start_date,
        desc: task.desc ? task.desc : "",
        userId: task?.user.id,
      };
    } else {
      return {
        id: null,
        createBy: user.id,
        name: "",
        start_time: "",
        end_time: "",
        status: 0,
        start_date: "",
        desc: "",
        userId: team[0]?.id,
      };
    }
  });

  const {
    data: groupData,
    error: groupError,
    loading: groupLoading,
  } = useQuery(GET_GROUP, {
    variables: {
      userId: user?.id,
    },
  });

  const [crateTask, { error: createTaskError, loading: crateTaskLoading }] =
    useMutation(CREATE_TASK);

  const [updateTask, { error: updateTaskError, loading: updateTaskLoading }] =
    useMutation(CREATE_TASK);

  const handleChange = (e, type) => {
    if (type == "status") {
      setStage(e);
      setItem((prevItem) => ({
        ...prevItem,
        [type]: STAUS_TASK[e.toLowerCase()],
      }));
    } else {
      setItem((prevItem) => ({
        ...prevItem,
        [type]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    const members = groupData?.getGroupByUser.members.filter(
      (item) => item.status !== 2
    );
    setTeam(members);
    setMember(task?.user);
    if (!task) {
      setItem((prev) => ({
        ...prev,
        userId: members ? members[0].id : "",
      }));
    }
  }, [groupData, task]);

  const submitHandler = async () => {
    let request = { ...item };
    request.start_time = formatTimeStamp(
      request.start_date,
      request.start_time
    );
    request.end_time = formatTimeStamp(request.start_date, request.end_time);
    if (task) {
      const { data } = await updateTask({
        variables: { ...request },
      });

      if (data?.createTask.errors.length > 0) {
        toast.error(data.createTask.errors[0].message);
      } else {
        toast.success("Update task success");
      }
    } else {
      const { data } = await crateTask({
        variables: { ...request },
      });

      if (data?.createTask.errors.length > 0) {
        toast.error(data.createTask.errors[0].message);
      } else {
        toast.success("Create task success");
      }
    }
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              value={item?.name}
              className="w-full rounded"
              onChange={(e) => handleChange(e, "name")}
            />

            <Textbox
              placeholder="Task Description"
              type="text"
              name="desc"
              label="Task Description"
              value={item?.desc}
              onChange={(e) => handleChange(e, "desc")}
              className="w-full rounded"
            />

            <UserList
              setTeam={setTeam}
              setItem={setItem}
              member={member}
              team={team}
            />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={(e) => handleChange(e, "status")}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  value={item?.start_date}
                  onChange={(e) => handleChange(e, "start_date")}
                  label="Task Date"
                  className="w-full rounded"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[50%]">
                <Textbox
                  placeholder="Time"
                  type="time"
                  name="timeStart"
                  label="Start time"
                  value={item?.start_time}
                  onChange={(e) => handleChange(e, "start_time")}
                  className="w-full rounded"
                />
              </div>
              <div className="w-[50%]">
                <Textbox
                  placeholder="Time"
                  type="time"
                  name="timeEnd"
                  label="End time"
                  value={item?.end_time}
                  onChange={(e) => handleChange(e, "end_time")}
                  className="w-full rounded"
                />
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
