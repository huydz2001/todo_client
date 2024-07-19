import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Loading from "../components/Loader";
import Tabs from "../components/Tabs";
import AddTask from "../components/task/AddTask";
import Table from "../components/task/Table";
import Title from "../components/Title";
import TaskTitle from "./../components/TaskTitle";
import { GET_TASKS } from "../graphql/task";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import { STAUS_TASK } from "../utils";

const TABS = [{ title: "List View", icon: <FaList /> }];

const TASK_TYPE = {
  todo: "bg-blue-600",
  doing: "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const params = useParams();
  const status = params?.status || "";
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timeSerch, setTimeSearch] = useState("");
  const [statusTask, setStatusTask] = useState(null);
  const [rows, rowChange] = useState([]);
  const [page, pageChange] = useState(0);
  const [rowPerPage, rowPerPageChange] = useState(5);
  const [total, setTotal] = useState(0);

  const handleChangeDate = (event) => {
    if (!event.target.value) {
      setTimeSearch("");
    }
    setDate(event.target.value);
  };

  const handleChangeTime = (event) => {
    setTime(event.target.value);
  };

  const handleBlurTime = (event) => {
    setTimeSearch(time);
  };

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
      date: date ? date : null,
      time: timeSerch ? timeSerch : null,
      createBy: user.status == 2 ? user.id : null,
      status: status ? STAUS_TASK[status] : null,
    },
  });

  useEffect(() => {
    setStatusTask(status);
    setTasks(tasksData?.getAllTasks.tasks);
    setTotal(tasksData?.getAllTasks.total);
  }, [tasksData, date, statusTask, timeSerch, page, rowPerPage]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {user.status == 2 && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>
      <Tabs tabs={TABS}>
        {!status ? (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <div className="w-40">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                value={date}
                onChange={handleChangeDate}
                className="w-full rounded"
              />
            </div>
            {date && (
              <div className="w-40">
                <Textbox
                  placeholder="Time"
                  type="time"
                  name="time"
                  value={time}
                  onBlur={handleBlurTime}
                  onChange={handleChangeTime}
                  className="w-full rounded"
                />
              </div>
            )}
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE.doing} />
            <TaskTitle label="completed" className={TASK_TYPE.completed} />
          </div>
        ) : (
          <div className="w-full flex gap-4 md:gap-x-12 py-4">
            <div className="w-40">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                value={date}
                onChange={handleChangeDate}
                className="w-full rounded"
              />
            </div>
            {date && (
              <div className="w-40">
                <Textbox
                  placeholder="Time"
                  type="time"
                  name="time"
                  value={time}
                  onBlur={handleBlurTime}
                  onChange={handleChangeTime}
                  className="w-full rounded"
                />
              </div>
            )}
          </div>
        )}
        {tasksLoading ? (
          <div className="py-10">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            {tasks && (
              <Table
                tasks={tasks}
                rows={rows}
                page={page}
                total={total}
                rowPerPage={rowPerPage}
                rowChange={rowChange}
                pageChange={pageChange}
                rowPerPageChange={rowPerPageChange}
              />
            )}
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} task={null} />
    </div>
  );
};

export default Tasks;
