import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

export function formatDate(date: string) {
	return format(new Date(date), "yyyy年M月d日", { locale: ja });
}
