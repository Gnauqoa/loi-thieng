import {
  createPost,
  getAndPutPosts,
  PostReducerType,
  usePost,
} from "@/config/redux/slices/post";
import PaginatedList from "@/components/PaginatedList";
import Post from "@/components/Post";
import { Image, TextInput, View } from "react-native";
import { useState } from "react";
import { Avatar, Button, Text } from "@rneui/themed";
import { toastSuccess } from "@/utils/toast";
import { useAuth } from "@/config/redux/slices/auth";

const WritePost = ({ onNewPost }: { onNewPost: (id: string) => void }) => {
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const { dispatch } = usePost();
  const { user } = useAuth();

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
        <Avatar
          rounded
          source={{ uri: user?.avatar_url || "" }}
          size="small"
          containerStyle={{ borderWidth: 1, borderColor: "primary" }}
        />
        <Text style={{ fontSize: 16 }}>Đăng bài viết của bạn...</Text>
      </View>
      <View className="flex flex-col  ml-8 gap-2 flex-1">
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="outline-none border-[1px] p-3 rounded-[8px]"
          placeholder="Tiêu đề"
          placeholderTextColor={"#e9e9e9"}
        />
        <TextInput
          multiline={true}
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
          className="outline-none border-[1px] p-3 h-[80px] flex-1 rounded-[8px]"
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
      <PaginatedList
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
            <WritePost
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
