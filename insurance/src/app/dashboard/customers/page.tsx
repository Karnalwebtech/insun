import RedirectBtn from "@/components/buttons/redirectBtn";
import CustomerList from "@/module/dashboard/customers/all-customers";

export default function page() {

  return <>
    <RedirectBtn title={"Add new"} url={"/dashboard/customers/add-customers"} />
    <CustomerList />
  </>
}
