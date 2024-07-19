import { createHttpLink, ApolloClient, ApolloLink, InMemoryCache, useMutation } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { REFRESH_TOKEN } from "../graphql/user";
import { onError } from '@apollo/client/link/error';
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
});


const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            'x-api-key': '$2b$10$QWLmlToajleQXGtqOuytFu1I5zOg097bwXXIiSWUec8Qd4anM7HQC',
            'Authorization': token ? `Bearer ${token}` : "",
        }
    }
});

const refreshAccessToken = async (refreshToken) => {
    try {
        const { data } = await client.mutate({
            mutation: REFRESH_TOKEN,
            variables: {
                token: refreshToken
            },
        });
        localStorage.setItem("token", data.refreshToken.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken.refreshToken);

        return data.refreshToken.accessToken;
    } catch (error) {
        toast.error('Something went wrong! Please login again.')
        console.error('Error refreshing access token:', error);
        throw error;
    }
}


// Create the error link to handle authentication errors
const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
    if (networkError?.statusCode === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        // Refresh the access token using the refresh token
        const oldHeaders = operation.getContext().headers;
        const newToken = refreshAccessToken(refreshToken)
        operation.setContext({
            headers: {
                ...oldHeaders,
                authorization: `Bear ${newToken}`,
            },
        });
        return forward(operation);
    }

});


const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
    credentials: 'include'
});

export default client;