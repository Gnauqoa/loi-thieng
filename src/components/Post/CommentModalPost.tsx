import React from "react";
import { Post as PostType } from "@/@types/post";
import { TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/config/redux/slices/auth";
import { Avatar, Button, Tooltip } from "@rneui/themed";
import useToggle from "@/hooks/useToggle";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import PostEditor from "./PostEditor";
import { deletePost, deletePosts, usePost } from "@/config/redux/slices/post";
import { toastSuccess } from "@/utils/toast";

const CommentModalPost = (props: PostType & { onClose: () => void }) => {
  const { title, user, content, created_at } = props;
  const [tooltip, , , onCloseTooltip, onOpenTooltip] = useToggle();
  const [editMode, , , onCloseEditMode, onOpenEditMode] = useToggle();
  const { user: currentUser } = useAuth();
  const { dispatch } = usePost();
  return (
    <View
      className={`flex flex-col gap-2 py-3 px-3 border-b-[#f1f1ef] border-b-[1px] relative`}
    >
      <View className="flex flex-row items-center gap-2">
        <Avatar
          rounded
          source={{ uri: props.user.avatar_url || "" }}
          size="small"
          containerStyle={{ borderWidth: 1 }}
        />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center gap-3">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
            </SizableText>
            <View className="flex flex-row items-center ml-auto gap-3">
              {currentUser?.role === "admin" ||
                (currentUser?.id === user.id && (
                  <View className="ml-auto">
                    <Tooltip
                      visible={tooltip}
                      onOpen={onOpenTooltip}
                      onClose={onCloseTooltip}
                      width={120}
                      height={60}
                      backgroundColor={"transparent"}
                      popover={
                        <View className="flex flex-col gap-2 py-1 shadow-xl rounded-[8px] bg-[#fff]">
                          <Button
                            icon={<Entypo name="edit" size={12} />}
                            iconPosition="left"
                            type="clear"
                            titleStyle={{
                              marginLeft: 4,
                              fontSize: 12,
                              color: "black",
                            }}
                            onPress={() => {
                              onOpenEditMode();
                              onCloseTooltip();
                            }}
                            title={"Chỉnh sửa"}
                          ></Button>
                          <Button
                            onPress={() => {
                              dispatch(
                                deletePost(props.id, () => {
                                  toastSuccess("Xoá bài viết thành công!");
                                  onCloseTooltip();
                                })
                              );
                            }}
                            icon={
                              <EvilIcons name="trash" size={20} color="red" />
                            }
                            iconPosition="left"
                            type="clear"
                            titleStyle={{
                              color: "red",
                              marginLeft: 4,
                              fontSize: 12,
                            }}
                            title={"Xoá"}
                          ></Button>
                        </View>
                      }
                    >
                      <Entypo
                        name="dots-three-horizontal"
                        size={20}
                        color="black"
                      />
                    </Tooltip>
                  </View>
                ))}
              <TouchableOpacity onPress={props.onClose}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <SizableText size={"$1"}>
            {dayjs(created_at).from(dayjs())}
          </SizableText>
        </View>
      </View>
      {editMode ? (
        <PostEditor
          post={props}
          onCancel={onCloseEditMode}
          onUpdatePost={onCloseEditMode}
        />
      ) : (
        <>
          <SizableText size={"$6"}>{title}</SizableText>
          <SizableText size={"$2"}>{content}</SizableText>
        </>
      )}
    </View>
  );
};

export default CommentModalPost;
