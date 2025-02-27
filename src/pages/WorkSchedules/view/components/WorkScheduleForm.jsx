import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { FormWrapper } from "@/components/common/form-wrapper";
  import {  workScheduleSchema } from "@/lib/schema";
import { DatePicker } from "@/components/common/date-picker";
  
  export const WorkScheduleForm = (props) => {
    return (
      <FormWrapper schema={workScheduleSchema} {...props}>
        {(form) => (
          <>
            <FormField
              control={form.control}
              name="workDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Work Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={(date) => field.onChange(date)}
                      title={"Pick a Work Date"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start At</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End At</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </>
        )}
      </FormWrapper>
    );
  };
  