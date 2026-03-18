import SearchCandidatesContent from "@/components/modules/Recruiter/SearchCandidatesContent";
import { protectPageByRole } from "@/lib/protectedPageHelpers";

const SearchCandidatesPage = async () => {
    await protectPageByRole("RECRUITER");
    return <SearchCandidatesContent />;
};

export default SearchCandidatesPage;
