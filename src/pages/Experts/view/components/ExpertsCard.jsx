import { Spinner } from "@/components/ui/spinner";
import { Col } from "@/components/common/grid/col";
import { displayDate,  displayNumber,  displayValue } from "@/lib/display";

export const ExpertsCard = ({
  fullName,
  specializations,
  yearsOfExperience,
  createdAt,
  description,
  isLoading,
}) => {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-3 border border-gray-200 p-4 rounded-lg">
      <Col label={"Full Name"} value={displayValue(fullName)} />
      <Col label={"Specializations"} value={displayValue(specializations)} />
      <Col label={"Years of Experience"} value={displayNumber(yearsOfExperience)} />
      <Col label={"Description"} value={displayValue(description)} />
      <Col label={"Created At"} value={displayDate(createdAt)} />
    </div>
  );
};
