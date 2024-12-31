import { Text, View } from "@tamagui/core";
import { Button } from "react-native";

import { login } from "@/config/redux/slices/auth";
import {
  getAndPushPostsSuccess,
  getAndPutPosts,
  getPost,
  getPosts,
  usePost,
} from "@/config/redux/slices/post";
import { useEffect } from "react";
import PaginatedList from "@/components/PaginatedList";
import Post from "@/components/Post";

const HomeScreen = () => {
  const { dispatch, total_items, current_page, total_pages, items, isLoading } =
    usePost();
  useEffect(() => {
    dispatch(
      getAndPutPosts({
        page: 1,
        per_page: 10,
      })
    );
  }, []);
  return (
    <View className="flex-1 px-4">
      <PaginatedList
        data={items}
        total_items={total_items}
        total_pages={total_pages}
        current_page={current_page}
        per_page={10}
        isLoading={isLoading}
        renderItem={({ item }) => <Post {...item} />}
        fetchData={(params) => {
          dispatch(getPosts(params));
        }}
      />
    </View>
  );
};

export default HomeScreen;
