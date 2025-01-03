import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { Avatar, Badge, Button } from "@rneui/themed";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { logout, updateProfile, useAuth } from "@/config/redux/slices/auth";
import { changePasswordAPI, getUploadAvatarSignature } from "@/apis/auth";
import { toastError, toastSuccess } from "@/utils/toast";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type UserForm = {
  first_name: string;
  last_name: string;
  phone: string;
  birth: Date | null;
  avatar_url: string | null;
};

interface EditPasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const EditPassword = () => {
  const [formData, setFormData] = useState<EditPasswordPayload>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleInputChange = (key: keyof EditPasswordPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { current_password, new_password, new_password_confirmation } =
      formData;

    if (!current_password || !new_password || !new_password_confirmation) {
      toastError("Lỗi, vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (new_password !== new_password_confirmation) {
      toastError("Lỗi, mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    if (new_password === current_password) {
      toastError("Lỗi, mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }
    try {
      await changePasswordAPI(formData);
      toastSuccess("Cập nhật mật khẩu thành công");
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      console.error(error);
      toastError(`Lỗi: ${(error as any).response.data.error.message}`);
    }
  };

  return (
    <View className="flex flex-col gap-3">
      <Text className="text-sm">Mật khẩu hiện tại</Text>
      <TextInput
        value={formData.current_password}
        onChangeText={(text) => handleInputChange("current_password", text)}
        placeholder="Nhập mật khẩu hiện tại"
        placeholderTextColor={"#e9e9e9"}
        secureTextEntry
        className="border border-gray-300 rounded-md px-3 py-2"
      />
      <Text className="text-sm">Mật khẩu mới</Text>
      <TextInput
        value={formData.new_password}
        onChangeText={(text) => handleInputChange("new_password", text)}
        placeholder="Nhập mật khẩu mới"
        placeholderTextColor={"#e9e9e9"}
        secureTextEntry
        className="border border-gray-300 rounded-md px-3 py-2"
      />
      <Text className="text-sm">Xác nhận mật khẩu mới</Text>
      <TextInput
        value={formData.new_password_confirmation}
        onChangeText={(text) =>
          handleInputChange("new_password_confirmation", text)
        }
        placeholder="Xác nhận mật khẩu mới"
        placeholderTextColor={"#e9e9e9"}
        secureTextEntry
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      <Button
        containerStyle={{ marginLeft: "auto", borderRadius: 8 }}
        titleStyle={{ fontSize: 12 }}
        title="Cập nhật mật khẩu"
        onPress={handleSubmit}
      />
    </View>
  );
};

const ProfileScreen = () => {
  const { user, dispatch } = useAuth();
  const [formData, setFormData] = useState<UserForm>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    birth: user?.birth ? new Date(user.birth) : null,
    avatar_url: user?.avatar_url || null,
  });

  const [currentAvatarFile, setCurrentAvatarFile] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: user?.phone || "",
        birth: user?.birth ? new Date(user.birth) : null,
        avatar_url: user?.avatar_url || null,
      });
    }
  }, [user]);

  const handleAvatarSelection = () => {
    Alert.alert(
      "Select Avatar",
      "Choose an option to set your avatar",
      [
        {
          text: "Camera",
          onPress: () => {
            launchCamera({ mediaType: "photo" }, (response) => {
              if (
                !response.didCancel &&
                response.assets &&
                response.assets.length > 0
              ) {
                setCurrentAvatarFile({
                  name: response.assets[0].fileName || "",
                  type: response.assets[0].type || "",
                });
                setFormData((prev) => ({
                  ...prev,
                  avatar_url:
                    response.assets && response.assets.length > 0
                      ? response.assets[0].uri || null
                      : null,
                }));
              }
            });
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            launchImageLibrary({ mediaType: "photo" }, (response) => {
              if (
                !response.didCancel &&
                response.assets &&
                response.assets.length > 0
              ) {
                setCurrentAvatarFile({
                  name: response.assets[0].fileName || "",
                  type: response.assets[0].type || "",
                });
                setFormData((prev) => ({
                  ...prev,
                  avatar_url:
                    response.assets && response.assets.length > 0
                      ? response.assets[0].uri || null
                      : null,
                }));
              }
            });
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleInputChange = (key: keyof UserForm, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      let avatar_url = formData.avatar_url;
      if (formData.avatar_url !== user?.avatar_url && formData.avatar_url) {
        // Get the Cloudinary signature and upload details
        const signatureResponse = await getUploadAvatarSignature();
        const signatureData = signatureResponse.data.data;

        const { signature, timestamp, api_key, public_id, cloud_name } =
          signatureData;

        const formDataUpload = new FormData();
        formDataUpload.append("api_key", api_key);
        formDataUpload.append("public_id", public_id);
        formDataUpload.append("timestamp", timestamp.toString());
        formDataUpload.append("signature", signature);
        formDataUpload.append("file", {
          uri: formData.avatar_url,
          type: currentAvatarFile?.type,
          name: `${public_id}.${currentAvatarFile?.type.split("/")[1]}`,
        } as any);

        const upload_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

        const response = await fetch(upload_url, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formDataUpload,
        });

        const responseData = await response.json();

        avatar_url = responseData.secure_url;

        setFormData((prev) => ({
          ...prev,
          avatar_url,
        }));
      }

      // Save other form data
      dispatch(
        updateProfile({
          ...formData,
          birth: formData.birth || undefined,
          avatar_url: avatar_url || "",
        })
      );
      toastSuccess("Cập nhật thành công");
      // Make an API call to update the user's profile with the updated data
    } catch (error) {
      console.error(error);
      toastError("Cập nhật thất bại");
    }
  };

  return (
    <View className="flex-1 bg-white p-4 gap-3">
      <TouchableOpacity
        onPress={handleAvatarSelection}
        className="items-center"
      >
        {formData.avatar_url ? (
          <View>
            <Avatar
              rounded
              source={{ uri: formData.avatar_url }}
              size="large"
              containerStyle={{ borderWidth: 1 }}
            />
            <Badge
              value={<Entypo name="edit" size={8} color="white" />}
              containerStyle={{ position: "absolute", bottom: 5, right: 0 }}
            />
          </View>
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-300 flex justify-center items-center">
            <Text className="text-gray-600">Thêm ảnh</Text>
          </View>
        )}
      </TouchableOpacity>
      <View className="flex flex-row gap-2">
        <View className="flex flex-col gap-1 flex-1">
          <Text className="text-sm">Họ</Text>
          <TextInput
            value={formData.first_name}
            onChangeText={(text) => handleInputChange("first_name", text)}
            placeholder="Enter your first name"
            placeholderTextColor={"#e9e9e9"}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </View>

        <View className="flex flex-col gap-1 flex-1">
          <Text className="text-sm">Tên</Text>
          <TextInput
            value={formData.last_name}
            onChangeText={(text) => handleInputChange("last_name", text)}
            placeholder="Enter your last name"
            placeholderTextColor={"#e9e9e9"}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </View>
      </View>
      {/* Phone */}
      <Text className="text-sm">Số điện thoại</Text>
      <TextInput
        value={formData.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
        placeholder="Enter your phone number"
        placeholderTextColor={"#e9e9e9"}
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-md px-3 py-2"
      />
      {/* Birth */}
      <Text className="text-sm">Ngày sinh</Text>
      <TouchableOpacity
        onPress={() => setDatePickerOpen(true)}
        className="border border-gray-300 rounded-md px-3 py-2 justify-center"
      >
        <Text>
          {formData.birth
            ? formData.birth.toISOString().split("T")[0]
            : "Select your birth date"}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isDatePickerOpen}
        date={formData.birth || new Date()}
        mode="date"
        onConfirm={(date: Date) => {
          setDatePickerOpen(false);
          handleInputChange("birth", date);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
      <View className="flex flex-col ">
        <Button
          onPress={handleSave}
          containerStyle={{ marginLeft: "auto", borderRadius: 8 }}
          titleStyle={{ fontSize: 12 }}
          title="Lưu"
        />
      </View>
      <EditPassword />
      <Button
        icon={<MaterialIcons name="logout" size={16} color="red" />}
        iconPosition="left"
        title={"Đăng xuất"}
        type="outline"
        buttonStyle={{ borderColor: "red" }}
        titleStyle={{ fontSize: 12, color: "red", marginLeft: 8 }}
        onPress={() =>
          Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Đăng xuất",
              onPress: () => {
                dispatch(logout());
              },
            },
          ])
        }
      ></Button>
    </View>
  );
};

export default ProfileScreen;
