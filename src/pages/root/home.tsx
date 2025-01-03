import React from "react";
import {
  getAndPutPosts,
  PostReducerType,
  usePost,
} from "@/config/redux/slices/post";
import PaginatedList from "@/components/PaginatedList";
import Post from "@/components/Post";
import { View } from "react-native";
import { useState } from "react";
import PostEditor from "@/components/Post/PostEditor";

const HomeScreen = () => {
  const [highlights, setHighlights] = useState<string[]>([]);
  const { dispatch, total_items, current_page, total_pages, items, isLoading } =
    usePost();

  return (
    <View className="flex flex-col flex-1 pt-3 bg-[#fff]">
      <PaginatedList
        className="gap-3"
        data={[{}, ...items]}
        total_items={total_items}
        total_pages={total_pages}
        current_page={current_page}
        per_page={10}
        isLoading={isLoading}
        renderItem={({ item }) =>
          (item as PostReducerType)?.id ? (
            <Post
              {...(item as PostReducerType)}
              isHighlight={highlights.includes(
                (item as PostReducerType).id.toString()
              )}
            />
          ) : (
            <PostEditor
              onNewPost={(id) => setHighlights((prev) => [...prev, id])}
            />
          )
        }
        fetchData={(params) => {
          dispatch(getAndPutPosts(params));
        }}
      />
    </View>
  );
};

export default HomeScreen;
