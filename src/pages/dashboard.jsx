import { useQuery } from "@apollo/client";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";
import UserInfo from "../components/UserInfo";
import { GET_GROUP } from "../graphql/group";
import { GET_TASKS } from "../graphql/task";
import { BGS, TASK_TYPE, formatDate, formatTime, getInitials } from "../utils";
import { TablePagination } from "@mui/material";

const TaskTable = ({
  tasks,
  total,
  rows,
  rowChange,
  page,
  pageChange,
  rowPerPage,
  rowPerPageChange,
}) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const handleChangePage = (event, newpage) => {
    pageChange(newpage);
  };

  const handleChangeRowsPerPage = (event) => {
    rowPerPageChange(event.target.value);
    pageChange(0);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Start Date</th>
        <th className="py-2">Start Time</th>
        <th className="py-2">End Time</th>
        <th className="py-2">Member</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])}
          />
          <p className="text-base text-black">{task.name}</p>
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
    </tr>
  );
  return (
    <>
      <div
        className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded"
        style={{
          minHeight: "353px",
          maxHeight: "353px",
          overflowX: scroll,
        }}
      >
        {tasks ? (
          <>
            <table className="w-full">
              <TableHeader />
              <tbody>
                {tasks.map((task, id) => (
                  <TableRow key={id} task={task} />
                ))}
              </tbody>
            </table>
            {total > 0 && (
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 20]}
                rowsPerPage={rowPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        ) : (
          <>
            <span className="text-2xl flex justify-center font-medium">
              You don't have any task
            </span>
          </>
        )}
      </div>
    </>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black  text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Status</th>
        <th className="py-2">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200  text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>

          <div>
            <p> {user.name}</p>
            <span className="text-xs text-black">
              {user?.status == 2 ? "Admin" : "Member"}
            </span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {!user?.isDelete ? "Active" : "Disabled"}
        </p>
      </td>
      <td className="py-2 text-sm">{moment(user?.created_at).fromNow()}</td>
    </tr>
  );

  return (
    <div className="w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded">
      <table className="w-full mb-5">
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [listTask, setTasks] = useState([]);
  const [taskRes, setTaskRes] = useState([]);
  const [rows, rowChange] = useState([]);
  const [page, pageChange] = useState(0);
  const [rowPerPage, rowPerPageChange] = useState(5);
  const [total, setTotal] = useState(0);

  const {
    data: groupData,
    loading: groupLoading,
    error: groupError,
  } = useQuery(GET_GROUP, {
    variables: {
      userId: user.id,
    },
  });

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery(GET_TASKS, {
    variables: {
      userId: user.status == 2 ? null : user.id,
      page: page ? page + 1 : 1,
      limit: rowPerPage ? rowPerPage : 5,
      field: "start_date",
      direction: "ASC",
      createBy: user.status == 2 ? user.id : null,
    },
  });

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: taskRes?.total || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLTED TASK",
      total: taskRes?.completed || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: taskRes?.doing || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: taskRes?.todo,
      icon: <FaArrowsToDot />,
      bg: "bg-[#1d4ed8]" || 0,
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setMembers(groupData?.getGroupByUser.members);
    setTasks(tasksData?.getAllTasks.tasks);
    setTaskRes(tasksData?.getAllTasks);
    setTotal(tasksData?.getAllTasks.total);
  }, [tasksData, groupData, page, rowPerPage]);

  return tasksLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        {/* /left */}
        {listTask && (
          <TaskTable
            tasks={listTask}
            rows={rows}
            page={page}
            total={total}
            rowPerPage={rowPerPage}
            rowChange={rowChange}
            pageChange={pageChange}
            rowPerPageChange={rowPerPageChange}
          />
        )}

        {/* /right */}

        {members && <UserTable users={members} />}
      </div>
    </div>
  );
};

export default Dashboard;
