import { PaginationParams } from "@/@types/pagination";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  ListRenderItem,
  FlatListProps,
} from "react-native";

interface PaginatedListProps<T> {
  data: T[];
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  fetchData: (param: PaginationParams) => void;
  isLoading: boolean;
  renderItem: ListRenderItem<T>;
  className?: string;
}

const PaginatedList = <T,>(props: PaginatedListProps<T>) => {
  const { data, isLoading, current_page, total_pages, fetchData, per_page } =
    props;
  const isLastPage = current_page >= total_pages;
  const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

  const handleNextPage = () => {
    if (isLastPage) return;
    fetchData({
      per_page,
      page: current_page + 1,
    });
  };

  useEffect(() => {
    fetchData({
      per_page,
      page: 1,
    });
    setIsFirstPageReceived(true);
  }, []);

  const renderItem: ListRenderItem<T> = props.renderItem;

  const ListEndLoader = () => {
    if (isLoading) {
      // Show loader at the end of the list when fetching the next page of data
      return <ActivityIndicator size="large" />;
    }
    return null;
  };

  if (!isFirstPageReceived && isLoading) {
    // Show loader when fetching the first page of data
    return <ActivityIndicator size="small" />;
  }

  return (
    <FlatList
      className={props.className}
      data={data}
      renderItem={renderItem}
      onEndReached={handleNextPage}
      onEndReachedThreshold={0.8}
      ListFooterComponent={ListEndLoader} // Loader when loading the next page
    />
  );
};

export default PaginatedList;
