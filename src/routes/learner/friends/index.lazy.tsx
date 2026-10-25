import SplitPanel from "@/components/SplitPanel";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import FriendDetail from "./-components/FriendDetail";
import FriendEmptyState from "./-components/FriendEmptyState";
import FriendItem from "./-components/FriendItem";
import FriendItemSkeleton from "./-components/FriendItemSkeleton";
import { useFriendsPage } from "./-hooks/useFriendsPage";
import "./friends.scss";

export const Route = createLazyFileRoute("/learner/friends/")({
  component: FriendsPage,
});

function FriendsPage() {
  const { user: currentUser } = Route.useRouteContext();

  const {
    t,
    typeFriend,
    setTypeFriend,
    selectedId,
    setSelectedId,
    displayList,
    friendDetailData,
    shouldShowAddFriendBtn,
    isLoading,
    handleRespondRequest,
    tabs,
  } = useFriendsPage(currentUser?.id);

  if (!currentUser) {
    return <FriendEmptyState />;
  }

  return (
    <Suspense
      fallback={
        <div className="friend-page">
          <FriendItemSkeleton />
          <FriendItemSkeleton />
          <FriendItemSkeleton />
        </div>
      }
    >
      <div className="friend-page">
        <SplitPanel>
          <SplitPanel.Tabs>
            {tabs.map((tab) => (
              <SplitPanel.Tab
                key={tab.value}
                active={typeFriend === tab.value}
                onClick={() => {
                  setTypeFriend(tab.value as typeof typeFriend);
                  setSelectedId(null);
                }}
              >
                {tab.label}
              </SplitPanel.Tab>
            ))}
          </SplitPanel.Tabs>

          <SplitPanel.Content>
            <SplitPanel.List className="friend-page__body-left">
              {isLoading ? (
                <FriendItemSkeleton />
              ) : (
                displayList.map((friend, idx) => (
                  <FriendItem
                    key={friend.id}
                    index={idx + 1}
                    id={friend.id}
                    name={friend.name}
                    imgUrl={friend.imgUrl}
                    typeFriendItem={friend.typeFriendItem}
                    streaks={friend.streaks}
                    isActive={selectedId === friend.id}
                    onClick={() => setSelectedId(friend.id)}
                    onAccept={() => handleRespondRequest(friend.id, true)}
                    onDecline={() => handleRespondRequest(friend.id, false)}
                  />
                ))
              )}
            </SplitPanel.List>

            <SplitPanel.Detail className="friend-page__body-right">
              {friendDetailData ? (
                <FriendDetail
                  {...friendDetailData}
                  currentUserId={currentUser.id}
                  showAddFriendBtn={shouldShowAddFriendBtn}
                />
              ) : (
                <div className="friend-page__placeholder-profile">
                  <h5>{t("friends.placeholder_heading")}</h5>
                  <p>{t("friends.placeholder_text")}</p>
                </div>
              )}
            </SplitPanel.Detail>
          </SplitPanel.Content>
        </SplitPanel>
      </div>
    </Suspense>
  );
}
