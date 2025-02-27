import { DeleteModal } from "@/components/common/delete-modal";
import { ActionsDropdown } from "@/components/common/view/actions-dropdown";
import { ColumnHeader } from "@/components/common/view/column-header";
import { EActions } from "@/enums/actions";
import { displayDate, displayValue } from "@/lib/display";
import PostsService from "@/services/posts.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useBoolean } from "usehooks-ts";
import { PostForm } from "@/pages/Posts/view/components/PostForm";
import { PostCard } from "@/pages/Posts/view/components/PostCard";

const usePosts = () => {
    const {
        value: open,
        setTrue: setOpen,
        setFalse: setClose,
      } = useBoolean(false);
      const {
        value: fetching,
        setTrue: setFetching,
        setFalse: setFetched,
      } = useBoolean(false);
    
      const [actions, setActions] = useState(EActions.CREATE);
      const [id, setId] = useState("");
      const queryClient = useQueryClient();
    
      const { data: blog, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: () => PostsService.getPost(id),
        enabled: !!id,
      });
    
      const createPostMutation = useMutation({
        mutationFn: (data) => PostsService.createPost(data),
        onMutate: () => {
          setFetching();
        },
        onError: () => {
          setFetched();
          toast.error("An error occurred");
          onClose();
        },
        onSuccess: () => {
          setFetched();
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
          toast.success("Create successfully");
          onClose();
        },
      });
    
      const updatePostMutation = useMutation({
        mutationFn: (data) => PostsService.updatePost(data),
        onMutate: () => {
          setFetching();
        },
        onError: () => {
          setFetched();
          toast.error("An error occurred");
          onClose();
        },
        onSuccess: () => {
          setFetched();
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
          toast.success("Update successfully");
          onClose();
        },
      });
    
      const deletePostMutation = useMutation({
        mutationFn: (id) => PostsService.deletePost(id),
        onMutate: () => {
          setFetching();
        },
        onError: () => {
          setFetched();
          toast.error("An error occurred");
          onClose();
        },
        onSuccess: () => {
          setFetched();
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
          toast.success("Delete successfully");
          onClose();
        },
      });
    
      function onOpenChange(action, id) {
        setId(id || "");
        setActions(action);
        setOpen();
      }
    
      function onClose() {
        setClose();
        setId("");
      }
    
      async function onSubmit(data) {
        if (actions === EActions.CREATE) {
          createPostMutation.mutate(data);
        } else {
          updatePostMutation.mutate({ id, ...data });
        }
      }
    
      function formConfigMap(action) {
        const mappingValues = {
          [EActions.CREATE]: {
            title: "Create Form",
            children: (
              <PostForm
                isLoading={isLoading}
                isSubmitting={fetching}
                onSubmit={onSubmit}
                onDismiss={onClose}
              />
            ),
          },
          [EActions.UPDATE]: {
            title: "Update Form",
            children: (
              <PostForm
                defaultValues={{
                  content: blog?.content || "",
                  title: blog?.title || "",
                }}
                isLoading={isLoading}
                isSubmitting={fetching}
                onSubmit={onSubmit}
                onDismiss={onClose}
              />
            ),
          },
          [EActions.VIEW]: {
            title: "View Blog",
            children: (
              <PostCard
                isLoading={isLoading}
                createdAt={blog?.createdAt || ""}
                content={blog?.content || ""}
                title={blog?.title || ""}
              />
            ),
          },
          [EActions.DELETE]: {
            title: "Delete Service",
            children: (
              <DeleteModal
                isSubmitting={fetching}
                onDismiss={onClose}
                onSubmitting={() => deletePostMutation.mutate(id.toString())}
              />
            ),
          },
        };
        return mappingValues[action];
      }
    
      const formConfig = formConfigMap(actions);
    
      const columns = [
        {
          accessorKey: "Title",
          header: ({ column }) => (
            <ColumnHeader column={column} title={displayValue("Title")} />
          ),
          cell: ({ row }) => displayValue(row.original.title),
        },
    
        {
          accessorKey: "Content",
          header: ({ column }) => (
            <ColumnHeader column={column} title={displayValue("Content")} />
          ),
          cell: ({ row }) => displayValue(row.original.content),
        },
        {
          accessorKey: "createdAt",
          header: ({ column }) => (
            <ColumnHeader column={column} title={displayValue("Created At")} />
          ),
          cell: ({ row }) => displayDate(row.original.createdAt),
        },
        {
          accessorKey: "actions",
          header: displayValue("Actions"),
          cell: ({ row }) => {
            return (
              <ActionsDropdown
                onView={() => onOpenChange(EActions.VIEW, row.original.blogId)}
                onDelete={() =>
                  onOpenChange(EActions.DELETE, row.original.blogId)
                }
                onEdit={() => onOpenChange(EActions.UPDATE, row.original.blogId)}
              />
            );
          },
        },
      ];
    
      const breadcrumb = [
        {
          title: "Blogs",
          url: "/blogs",
        },
      ];
    
      return {
        open,
        breadcrumb,
        columns,
        blog,
        actions,
        fetching,
        isLoading,
        formConfig,
        id,
        onClose,
        onOpenChange,
      };
}
 
export default usePosts;