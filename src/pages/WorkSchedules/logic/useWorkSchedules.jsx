import { ActionsDropdown } from "@/components/common/view/actions-dropdown";
import { ColumnHeader } from "@/components/common/view/column-header";
import { EActions } from "@/enums/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useBoolean } from "usehooks-ts";
import toast from "react-hot-toast";
import { DeleteModal } from "@/components/common/delete-modal";
import { displayDate, displayNumber, displayValue } from "@/lib/display";
import WorkScheduleService from "@/services/work-schedule.service";
import { WorkScheduleForm } from "@/pages/WorkSchedules/view/components/WorkScheduleForm";
import { WorkScheduleCard } from "@/pages/WorkSchedules/view/components/WorkScheduleCard";

const useWorkSchedules = () => {
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

  const { data: workSchedule, isLoading } = useQuery({
    queryKey: ["work-schedule", id],
    queryFn: () => WorkScheduleService.getWorkSchedule(id),
    enabled: !!id,
  });

  const createWorkScheduleMutation = useMutation({
    mutationFn: (data) => WorkScheduleService.createWorkSchedule(data),
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
        queryKey: ["work-schedules"],
      });
      toast.success("Create successfully");
      onClose();
    },
  });

  const updateWorkScheduleMutation = useMutation({
    mutationFn: (data) => WorkScheduleService.updateWorkSchedule(id, data),
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
        queryKey: ["work-schedules"],
      });
      toast.success("Update successfully");
      onClose();
    },
  });

  const deleteWorkScheduleMutation = useMutation({
    mutationFn: () => WorkScheduleService.deleteWorkSchedule(id),
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
        queryKey: ["work-schedules"],
      });
      toast.success("Delete successfully");
      onClose();
    },
  });

  const breadcrumb = [
    {
      title: "Work Schedules",
      url: "/work-schedules",
    },
  ];

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
      createWorkScheduleMutation.mutate(data);
    }
    if (actions === EActions.UPDATE) {
      updateWorkScheduleMutation.mutate(data);
    }
  }

  function formConfigMap(action) {
    const mappingValues = {
      [EActions.CREATE]: {
        title: "Create Work Schedule",
        children: (
          <WorkScheduleForm
            isLoading={isLoading}
            isSubmitting={fetching}
            onSubmit={onSubmit}
            onDismiss={onClose}
          />
        ),
      },
      [EActions.UPDATE]: {
        title: "Update Work Schedule",
        children: (
          <WorkScheduleForm
            defaultValues={{
              serviceName: workSchedule?.serviceName || "",
              price: workSchedule?.price.toString() || "0",
              type: workSchedule?.type || "",
              description: workSchedule?.description || "",
              duration: workSchedule?.duration.toString() || "0",
            }}
            isLoading={isLoading}
            isSubmitting={fetching}
            onSubmit={onSubmit}
            onDismiss={onClose}
          />
        ),
      },
      [EActions.VIEW]: {
        title: "View Work Schedule",
        children: (
          <WorkScheduleCard
            isLoading={isLoading}
            serviceName={workSchedule?.serviceName || ""}
            price={workSchedule?.price || 0}
            type={workSchedule?.type || ""}
            createdAt={workSchedule?.created_at?.toString() || ""}
            description={workSchedule?.description || ""}
          />
        ),
      },
      [EActions.DELETE]: {
        title: "Delete Work Schedule",
        children: (
          <DeleteModal
            isSubmitting={fetching}
            onDismiss={onClose}
            onSubmitting={() => deleteWorkScheduleMutation.mutate(id.toString())}
          />
        ),
      },
    };
    return mappingValues[action];
  }

  const formConfig = formConfigMap(actions);

  const columns = [
    {
      accessorKey: "serviceName",
      header: ({ column }) => (
        <ColumnHeader column={column} title={displayValue("Service Name")} />
      ),
      cell: ({ row }) => displayValue(row.original.serviceName),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <ColumnHeader column={column} title={displayValue("Price (VND)")} />
      ),
      cell: ({ row }) => displayNumber(row.original.price),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <ColumnHeader column={column} title={displayValue("Type")} />
      ),
      cell: ({ row }) => displayValue(row.original.type),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <ColumnHeader column={column} title={displayValue("Created At")} />
      ),
      cell: ({ row }) => displayDate(row.original.created_at),
    },
    {
      accessorKey: "actions",
      header: displayValue("Actions"),
      cell: ({ row }) => {
        return (
          <ActionsDropdown
            onView={() => onOpenChange(EActions.VIEW, row.original.serviceId)}
            onDelete={() =>
              onOpenChange(EActions.DELETE, row.original.serviceId)
            }
            onEdit={() => onOpenChange(EActions.UPDATE, row.original.serviceId)}
          />
        );
      },
    },
  ];

  return {
    open,
    breadcrumb,
    columns,
    workSchedule,
    actions,
    fetching,
    isLoading,
    formConfig,
    id,
    onClose,
    onOpenChange,
  };
};

export default useWorkSchedules;
