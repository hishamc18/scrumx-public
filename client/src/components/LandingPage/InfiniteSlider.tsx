"use client";
import React from "react";

const InfiniteScroller = () => {
    return (
        <div className="scroller h-20 flex items-center bg-gray-200 border border-white" data-speed="fast">
            <div className="absolute left-0 top-0 h-full z-30 w-[80px] bg-gradient-to-r from-white via-white/75 to-transparent"></div>
            <ul className="tag-list scroller__inner">
                {/* Duplicate the content inside for seamless looping */}
                {[...Array(1)].map((_, index) => (
                    <React.Fragment key={index}>
                        <li className="cursor-none">Project Handling</li>
                        <li className="cursor-none">Conference</li>
                        <li className="cursor-none">24/7 Support</li>
                        <li className="cursor-none">Chat</li>
                        <li className="cursor-none">Realtime</li>
                        <li className="cursor-none">Collab Notes</li>
                        <li className="cursor-none">Sticky</li>
                        <li className="cursor-none">Self</li>
                        <li className="cursor-none">Minimal</li>
                        <li className="cursor-none">Prioritize</li>
                        <li className="cursor-none">Time Estimate</li>
                        <li className="cursor-none">Deadline</li>
                        <li className="cursor-none">Assigning</li>
                        <li className="cursor-none">Task Handling</li>
                        <li className="cursor-none">Meeting</li>
                        <li className="cursor-none">Scheduling</li>
                        <li className="cursor-none">Free</li>
                        <li className="cursor-none">Kanban</li>
                        <li className="cursor-none">Status</li>
                        <li className="cursor-none">Notify</li>
                        <li className="cursor-none">Speed</li>
                        <li className="cursor-none">Customization</li>
                        <li className="cursor-none">Project Handling</li>
                        <li className="cursor-none">Conference</li>
                        <li className="cursor-none">24/7 Support</li>
                        <li className="cursor-none">Chat</li>
                        <li className="cursor-none">Realtime</li>
                        <li className="cursor-none">Collab Notes</li>
                        <li className="cursor-none">Sticky</li>
                        <li className="cursor-none">Self</li>
                        <li className="cursor-none">Minimal</li>
                        <li className="cursor-none">Prioritize</li>
                        <li className="cursor-none">Time Estimate</li>
                        <li className="cursor-none">Deadline</li>
                        <li className="cursor-none">Assigning</li>
                        <li className="cursor-none">Task Handling</li>
                        <li className="cursor-none">Meeting</li>
                        <li className="cursor-none">Scheduling</li>
                        <li className="cursor-none">Free</li>
                        <li className="cursor-none">Kanban</li>
                        <li className="cursor-none">Status</li>
                        <li className="cursor-none">Notify</li>
                        <li className="cursor-none">Speed</li>
                        <li className="cursor-none">Customization</li>
                        <li className="cursor-none">Project Handling</li>
                        <li className="cursor-none">Conference</li>
                        <li className="cursor-none">24/7 Support</li>
                        <li className="cursor-none">Chat</li>
                        <li className="cursor-none">Realtime</li>
                        <li className="cursor-none">Collab Notes</li>
                        <li className="cursor-none">Sticky</li>
                        <li className="cursor-none">Self</li>
                        <li className="cursor-none">Minimal</li>
                        <li className="cursor-none">Prioritize</li>
                        <li className="cursor-none">Time Estimate</li>
                        <li className="cursor-none">Deadline</li>
                        <li className="cursor-none">Assigning</li>
                        <li className="cursor-none">Task Handling</li>
                        <li className="cursor-none">Meeting</li>
                        <li className="cursor-none">Scheduling</li>
                        <li className="cursor-none">Free</li>
                        <li className="cursor-none">Kanban</li>
                        <li className="cursor-none">Status</li>
                        <li className="cursor-none">Notify</li>
                        <li className="cursor-none">Speed</li>
                        <li className="cursor-none">Customization</li>
                        <li className="cursor-none">Project Handling</li>
                        <li className="cursor-none">Conference</li>
                        <li className="cursor-none">24/7 Support</li>
                        <li className="cursor-none">Chat</li>
                        <li className="cursor-none">Realtime</li>
                        <li className="cursor-none">Collab Notes</li>
                        <li className="cursor-none">Sticky</li>
                        <li className="cursor-none">Self</li>
                        <li className="cursor-none">Minimal</li>
                        <li className="cursor-none">Prioritize</li>
                        <li className="cursor-none">Time Estimate</li>
                        <li className="cursor-none">Deadline</li>
                        <li className="cursor-none">Assigning</li>
                        <li className="cursor-none">Task Handling</li>
                        <li className="cursor-none">Meeting</li>
                        <li className="cursor-none">Scheduling</li>
                        <li className="cursor-none">Free</li>
                        <li className="cursor-none">Kanban</li>
                        <li className="cursor-none">Status</li>
                        <li className="cursor-none">Notify</li>
                        <li className="cursor-none">Speed</li>
                        <li className="cursor-none">Customization</li>
                    </React.Fragment>
                ))}
            </ul>
            <div className="absolute right-0 top-0 h-full z-30 w-[80px] bg-gradient-to-l from-white via-white/75 to-transparent"></div>
        </div>
    );
};

export default InfiniteScroller;
