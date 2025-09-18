const RAW = process.env.REACT_APP_API_BASE || "";
const BASE = RAW.replace(/\/+$/, "");

export async function api(path, options = {}) {
  const token = localStorage.getItem("sparrow_token");
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("sparrow_token");
    throw new Error("Unauthorized");
  }
  return res;
}

export async function getAllUsers(query = "") {
  const res = await api(`/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  const rows = await res.json();
  return query.trim()
    ? rows.filter(u =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        (u.fullName && u.fullName.toLowerCase().includes(query.toLowerCase()))
      )
    : rows;
}

export async function follow(userId) {
  return api(`/api/follow/${userId}`, { method: "POST" });
}

export async function unfollow(userId) {
  return api(`/api/follow/${userId}`, { method: "DELETE" });
}

export async function getFollowing(page = 1, pageSize = 1000) {
  const res = await api(`/api/follow/following?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch following");
  return res.json();
}

// (optional) keep a matching helper for followers (plural path)
export async function getFollowers(page = 1, pageSize = 1000) {
  const res = await api(`/api/follow/followers?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
}

// use api() so BASE, headers, and 401 logic apply
export async function createPost(content) {
  const res = await api(`/api/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(await res.text() || "Failed to create post");
  return res.json(); // returns the created post DTO
}

export async function getFeed(page = 1, pageSize = 20) {
  const res = await api(`/api/posts/feed?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch feed");
  return res.json(); 
}

export async function likePost(postId) {
  const res = await api(`/api/posts/${postId}/like`, { method: "POST" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to like post");
}

export async function unlikePost(postId) {
  const res = await api(`/api/posts/${postId}/like`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to unlike post");
}

export async function addComment(postId, content) {
  const res = await api(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}