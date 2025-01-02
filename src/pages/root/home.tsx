import { getAndPutPosts, usePost } from "@/config/redux/slices/post";
import PaginatedList from "@/components/PaginatedList";
import Post from "@/components/Post";

const HomeScreen = () => {
  const { dispatch, total_items, current_page, total_pages, items, isLoading } =
    usePost();

  return (
    <PaginatedList
      className="bg-[#fff]"
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
  );
};

export default HomeScreen;
