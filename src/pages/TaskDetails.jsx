import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import { tasks } from "../assets/data";
import Button from "../components/Button";
import Loading from "../components/Loader";
import Tabs from "../components/Tabs";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
  formatTime,
  getInitials,
} from "../utils";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [{ title: "Task Detail", icon: <FaTasks /> }];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  doing: (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const task = tasks.find((item) => (item._id = id));

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>

      <Tabs tabs={TABS}>
        <>
          <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">
            {/* LEFT */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="flex items-center gap-5">
                {/* <div
                  className={clsx(
                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[task?.priority],
                    bgColor[task?.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[task?.priority]}</span>
                  <span className="uppercase">{task?.priority} Priority</span>
                </div> */}

                <div className={clsx("flex items-center gap-2")}>
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full",
                      TASK_TYPE[task.stage]
                    )}
                  />
                  <span className="text-black uppercase">{task?.stage}</span>
                </div>
              </div>

              <div className="text-gray-500">
                Create at:
                <span className="text-black ml-1">
                  {formatDate(new Date(task?.date))}
                </span>
              </div>

              <div className="text-gray-500">
                Start time:
                <span className="text-black ml-1">
                  {formatTime(new Date(task?.start_time))}
                </span>
              </div>

              <div className="text-gray-500">
                End time:
                <span className="text-black ml-1">
                  {formatTime(new Date(task?.end_time))}
                </span>
              </div>

              <div className="space-y-4 py-6">
                <p className="text-gray-600 font-semibold test-sm">TASK TEAM</p>
                <div className="space-y-3">
                  {task?.team?.map((m, index) => (
                    <div
                      key={index}
                      className="flex gap-4 py-2 items-center border-t border-gray-200"
                    >
                      <div
                        className={
                          "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                        }
                      >
                        <span className="text-center">
                          {getInitials(m?.name)}
                        </span>
                      </div>

                      <div>
                        <p className="text-lg font-semibold">{m?.name}</p>
                        <span className="text-gray-500">{m?.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      </Tabs>
    </div>
  );
};

export default TaskDetails;
