import { gql, useQuery } from '@apollo/client';

export const LOGIN_QUERY = gql`
mutation Login($emailOrUsername: String!, $password: String!) {
    login(req: { emailOrUsername: $emailOrUsername, password: $password }) {
      code
      success
      message
      accessToken
      refreshToken
      errors {
        field
        message
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
        code
        success
        message
        accessToken
        refreshToken
    }
}
`;