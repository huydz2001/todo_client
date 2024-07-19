import { gql } from "@apollo/client";

export const GET_TASKS = gql`
query GetAllTasks(
    $userId: Int, 
    $page: Int!, 
    $limit: Int!, 
    $time: String, 
    $date: String, 
    $status: Int,
    $search: String,
    $field: String!,
    $direction: String!
    $createBy: Int) {
    getAllTasks(userId: $userId
        fillter: {
            time: $time
            date: $date
            status: $status
            search: $search
            createBy: $createBy
            pagination: { page: $page, limit: $limit }
            sort: { field: $field, direction: $direction }
        }) {
        code
        success
        message
        total
        currentPage
        nextPage
        prevPage
        lastPage
        errors {
            field
            message
        }
        tasks {
            isDelete
            created_at
            updated_at
            id
            name
            start_date
            start_time
            end_time
            status
            desc
            user {
                id
                name
                email
                status
            }
        }
        todo
        doing
        completed
    }
}`;

export const CREATE_TASK = gql`
mutation CreateTask(
    $id: Int, 
    $name: String!, 
    $start_date:String!, 
    $end_time: Timestamp!, 
    $start_time: Timestamp!
    $desc: String,
    $status: Int,
    $createBy: Int!
    $userId: Int!) {
    createTask(
        req: {
            id: $id
            name: $name
            start_date: $start_date
            start_time: $start_time
            end_time: $end_time
            desc: $desc
            status: $status
            createBy: $createBy
            userId: $userId
        }
    ) {
        code
        success
        message
        errors {
            field
            message
        }
        task {
            id
            name
        }
    }
}
`

export const DELETE_TASK = gql`
mutation DeleteTask($id:Int!) {
    deleteTask(id: $id) {
        code
        success
        message
        errors {
            field
            message
        }
        task {
            id
            name
        }
    }
}
`