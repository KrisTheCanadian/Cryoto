/* eslint-disable no-process-env */
export const apiEndpoint =
  process.env.VITE_API_BASE_URL || 'https://localhost:7175/';

// Posts
export const apiRoutePosts = `${apiEndpoint}posts`;
// Post Feed
export const apiRoutePostsGetUserFeed = `${apiRoutePosts}/GetUserFeedPaginated`;
export const apiRoutePostsGetAllPosts = `${apiRoutePosts}/GetAllPosts`;
// Crud
export const apiRoutePostsGetPostById = `${apiRoutePosts}/GetPostById`;
export const apiRoutePostsCreatePost = `${apiRoutePosts}/Create`;
export const apiRoutePostsUpdatePost = `${apiRoutePosts}/Update`;
export const apiRoutePostsDeletePost = `${apiRoutePosts}/Delete`;

// UserProfile
export const apiRouteUserProfile = `${apiEndpoint}userProfile`;
export const apiRouteUserProfileGetUserProfile = `${apiRouteUserProfile}/GetUserProfile`;
export const apiRouteUserGetAllUsers = `${apiRouteUserProfile}/GetAllUsers`;
