import { useMutation } from "@apollo/client";
import { TablePagination } from "@mui/material";
import clsx from "clsx";
import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { DELETE_TASK } from "../../graphql/task";
import { BGS, TASK_TYPE, formatDate, formatTime } from "../../utils";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import UserInfo from "../UserInfo";
import AddTask from "./AddTask";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { set } from "react-hook-form";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({
  tasks,
  rows,
  rowChange,
  page,
  pageChange,
  rowPerPage,
  total,
  rowPerPageChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [task, setTask] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleChangePage = (event, newpage) => {
    pageChange(newpage);
  };

  const handleChangeRowsPerPage = (event) => {
    rowPerPageChange(event.target.value);
    pageChange(0);
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const taskDetail = (id) => {
    navigate(`/task/${id}`);
  };

  const handleEdit = (task) => {
    setTask(task);
    setOpenEdit(true);
  };

  const [deleteTask, { error: delTaskEror, loading: delTaskLoading }] =
    useMutation(DELETE_TASK);

  const deleteHandler = async () => {
    const res = await deleteTask({
      variables: {
        id: selected,
      },
    });

    if (res?.deleteTask?.errors.length > 0) {
      toast.error("Something went wrong!");
    } else {
      toast.success("Delete task success");
      setTimeout(() => {
        setOpenDialog(false);
      }, 1000);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black  text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Start Time</th>
        <th className="py-2">End Time</th>
        <th className="py-2">Member</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <>
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10 ">
        <td className="py-2 cursor-pointer" onClick={() => taskDetail(task.id)}>
          <div className="flex items-center gap-2">
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])}
            />
            <p className="w-full line-clamp-2 text-base text-black">
              {task?.name}
            </p>
          </div>
        </td>

        <td className="py-2">
          <span className="text-sm text-gray-600">
            {formatDate(new Date(task?.start_date))}
          </span>
        </td>

        <td className="py-2">
          <span className="text-sm text-gray-600">
            {formatTime(new Date(task?.start_time))}
          </span>
        </td>

        <td className="py-2">
          <span className="text-sm text-gray-600">
            {formatTime(new Date(task?.end_time))}
          </span>
        </td>

        <td className="py-2">
          <div className="flex">
            <div
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[(Math.floor(Math.random() * 4) + 1) % BGS.length]
              )}
            >
              <UserInfo user={task?.user} />
            </div>
          </div>
        </td>

        <td className="py-2 flex gap-2 md:gap-4 justify-center">
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Edit"
            type="button"
            onClick={() => handleEdit(task)}
          />

          {user?.status == 2 && (
            <Button
              className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
              label="Delete"
              type="button"
              onClick={() => deleteClick(task.id)}
            />
          )}
        </td>
      </tr>
    </>
  );
  return (
    <>
      <div className="bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div
          className="overflow-x-auto "
          style={{
            minHeight: "450px",
            maxHeight: "450px",
            overflowX: scroll,
          }}
        >
          <table className="w-full ">
            <TableHeader />
            <tbody>
              {tasks?.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
          {total > 0 && (
            <TablePagination
              component="div"
              count={total}
              rowsPerPageOptions={[5, 10, 20]}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}

          {task && (
            <AddTask
              open={openEdit}
              setOpen={setOpenEdit}
              task={task}
              key={new Date().getTime()}
            />
          )}
        </div>
      </div>

      {/* TODO */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;
