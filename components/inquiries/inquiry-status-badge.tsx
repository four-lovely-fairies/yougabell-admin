import { Badge } from "@/components/ui/badge";
import { INQUIRY_STATUS_LABELS, type InquiryStatus } from "@/lib/api";

// 색만으로 구분하지 않도록 라벨을 항상 함께 노출한다.
const VARIANTS: Record<
  InquiryStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  received: "destructive",
  in_progress: "default",
  answered: "secondary",
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <Badge variant={VARIANTS[status]}>{INQUIRY_STATUS_LABELS[status]}</Badge>
  );
}
