import React, { useEffect, useState, useMemo } from "react";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData } from "@/redux/features/authSlice";
import LougoutComponent from "@/components/Layout/LougoutComponent";
import { setSearchTerm, fetchSuggestions, clearSuggestions } from "@/redux/features/searchSlice";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

interface Suggestion {
    name: string;
    type: string;
    route?: string;
}

function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpenLogout, setIsOpenLogout] = useState(false);
    const { searchTerm, suggestions } = useSelector((state: RootState) => state.search);

    const toggleLogout = () => setIsOpenLogout(!isOpenLogout);

    useEffect(() => {
        dispatch(getNewUserData());
    }, [dispatch]);

    const debounceSearch = useMemo(
        () =>
            debounce((query: string) => {
                if (query.trim()) {
                    dispatch(fetchSuggestions({ query }));
                } else {
                    dispatch(clearSuggestions());
                }
            }, 300),
        [dispatch]
    );

    const handleSuggestionClick = (item: Suggestion) => {
        debounceSearch.cancel();
        if (item.route) {
            router.push(item.route);
            dispatch(clearSuggestions());
            dispatch(setSearchTerm(""));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        dispatch(setSearchTerm(query));
        debounceSearch(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            handleSuggestionClick(suggestions[0]);
        }
    };

  return (
    <>
      <nav className="w-full h-[81px] bg-white flex items-center shadow-md justify-between px-4 sm:px-8">
        {/* Logo Section */}
        <div className="flex gap-2  sm:w-[600px] sm:justify-between">
          <div className="flex items-center ">
            <span className="hover: cursor-default text-gray-800 text-[22px] font-bold" onClick={()=>router.push('/home')}>ScrumX</span>
          </div>
          {/* Search Bar */}
          <div className="relative w-[170px] sm:w-[303px]">
            <input
              type="search"
              placeholder="Search Projects"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="w-full h-[33px] border border-gray-300 placeholder-gray-500 bg-gray-100 rounded-l-[10px] rounded-r-[20px] pl-4 pr-10 focus:outline-none focus:border-black text-primaryDark  "
            />
            <div className="w-[33px] h-[33px] rounded-full bg-textColor flex items-center justify-center absolute top-0 right-0 ">
              <IoSearch className="text-white" aria-label="Search" />
            </div>

                        {suggestions.length > 0 && (
                            <div className="absolute bg-white shadow-md w-full max-h-[250px] overflow-y-auto scrollbar-hidden mt-2 rounded-lg">
                                {/* Project Suggestions */}
                                {suggestions.some((item) => item.type === "Project") && (
                                    <div>
                                        <div className="bg-gray-100 p-1 font-bold text-[14px] text-primaryDark">
                                            {" "}
                                            Projects
                                        </div>
                                        {suggestions
                                            .filter((item) => item.type === "Project")
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 text-[12px] text-black cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSuggestionClick(item)}
                                                >
                                                    {item.name}
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* Notes Suggestions */}
                                {suggestions.some((item) => item.type === "Note") && (
                                    <div>
                                        <div className="bg-gray-100 p-2 font-bold text-[14px] text-primaryDark mt-2">
                                            Note
                                        </div>
                                        {suggestions
                                            .filter((item) => item.type === "Note")
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 text-[12px] text-black cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSuggestionClick(item)}
                                                >
                                                    {item.name}
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* Trello Suggestions */}
                                {suggestions.some((item) => item.type === "Trello") && (
                                    <div>
                                        <div className="bg-gray-100 p-2 font-bold text-[14px] text-primaryDark mt-2">
                                            Trello
                                        </div>
                                        {suggestions
                                            .filter((item) => item.type === "Trello")
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 text-[12px] text-black cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSuggestionClick(item)}
                                                >
                                                    {item.name}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {suggestions.length === 0 && searchTerm && (
                            <div className="absolute bg-white shadow-md w-full p-2 text-gray-500 text-center mt-2 rounded-lg">
                                No Results Found
                            </div>
                        )}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center space-x-2 relative">
                    <div className=" flex items-center">
                        <img
                            src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/Avatar.png"}
                            alt="User Avatar"
                            className="rounded-full w-[50px] h-[50px]"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="hidden lg:flex flex-col">
                        <span className="text-gray-800 font-semibold flex items-center gap-1">
                            {`${user?.firstName} ${user?.lastName}`}
                            <FaChevronDown
                                className="text-gray-600 cursor-pointer ml-1 -mt-1 h-[11px] w-[11px]"
                                onClick={() => toggleLogout()}
                            />
                        </span>
                        <small className="text-gray-600">{user?.userProfession?.slice(0, 15)}</small>
                    </div>
                </div>
            </nav>
            <div>
                <LougoutComponent isOpen={isOpenLogout} onClose={() => setIsOpenLogout(false)}></LougoutComponent>
            </div>
        </>
    );
}

export default Navbar;
