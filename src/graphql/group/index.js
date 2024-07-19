import { gql, useQuery } from '@apollo/client';

export const GET_GROUP = gql`
  query GetGroupByUser($userId: Int!) {
    getGroupByUser(userId: $userId) {
      isDelete
      created_at
      updated_at
      id
      group_name
      avatar
      members {
        id
        name
        email
        status
      }
    }
  }
`;


export const ADD_USER_GROUP = gql`
mutation AddUserGroup($groupId: Int!, $userName: String!) {
    addUserGroup(req: { groupId: $groupId, userName: $userName }) {
        code
        success
        message
        groupId
        errors {
          field
          message
        }
    }
}`;

export const DEL_USER_GROUP = gql`
mutation DeleteUserGroup($groupId: Int!, $userName: String!) {
    deleteUserGroup(req: { groupId: $groupId, userName: $userName }) {
        code
        success
        message
        groupId
        errors {
          field
          message
        }
    }
}`;





