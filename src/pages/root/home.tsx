import {
  createPost,
  getAndPutPosts,
  usePost,
} from "@/config/redux/slices/post";
import PaginatedList from "@/components/PaginatedList";
import Post from "@/components/Post";
import { TextInput, View } from "react-native";
import { useState } from "react";
import { Button, Text } from "@rneui/themed";
import { toastSuccess } from "@/utils/toast";

const WritePost = ({ onNewPost }: { onNewPost: (id: string) => void }) => {
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const { dispatch } = usePost();

  const handleReset = () => {
    setComment("");
    setTitle("");
  };

  const handleCreate = () => {
    dispatch(
      createPost({ content: comment, title, category_id: 1 }, (post) => {
        onNewPost(post.id.toString());
        handleReset();
        toastSuccess("Đăng bài viết thành công!");
      })
    );
  };
  return (
    <View className="flex flex-col gap-2 px-3">
      <View className="flex flex-row gap-2 items-center">
        <View className="w-6 h-6 bg-black rounded-full" />
        <Text style={{ fontSize: 16 }}>Đăng bài viết của bạn...</Text>
      </View>
      <View className="flex flex-col  ml-8 gap-2 flex-1">
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="outline-none border-[1px] p-3"
          placeholder="Tiêu đề"
          placeholderTextColor={"#e9e9e9"}
        />
        <TextInput
          multiline={true}
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
          className="outline-none border-[1px] p-3 h-[40px] flex-1"
          placeholder="Nội dung"
          placeholderTextColor={"#e9e9e9"}
        />
      </View>
      <Button
        onPress={handleCreate}
        disabled={!comment.length || !title.length}
        buttonStyle={{
          marginLeft: "auto",
          borderRadius: 4,
        }}
        titleStyle={{ fontSize: 12 }}
        title={"Đăng"}
      />
    </View>
  );
};

const HomeScreen = () => {
  const [highlights, setHighlights] = useState<string[]>([]);
  const { dispatch, total_items, current_page, total_pages, items, isLoading } =
    usePost();

  return (
    <View className="flex flex-col flex-1 pt-3 bg-[#fff]">
      <WritePost
        onNewPost={(id: string) => setHighlights((prev) => [...prev, id])}
      />
      <PaginatedList
        data={items}
        total_items={total_items}
        total_pages={total_pages}
        current_page={current_page}
        per_page={10}
        isLoading={isLoading}
        renderItem={({ item }) => <Post {...item} />}
        fetchData={(params) => {
          dispatch(getAndPutPosts(params));
        }}
      />
    </View>
  );
};

export default HomeScreen;
