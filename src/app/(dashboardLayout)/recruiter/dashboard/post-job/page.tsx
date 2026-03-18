import PostJobContent from "@/components/modules/Recruiter/PostJobContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const PostJobPage = async () => {
    await protectPageByRole("RECRUITER");
    return <PostJobContent />;
};

export default PostJobPage;
