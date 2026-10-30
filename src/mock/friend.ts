import { DEFAULT_AVATAR } from "@/constants/avatar";
import type { TFriendDetail } from "@learner/friends/-components/FriendDetail/type";
import type { TFriendItem } from "@learner/friends/-components/FriendItem/type";

export const MOCK_FRIEND: TFriendItem[] = [
  {
    id: "1",
    name: "Do Duc Anh",
    imgUrl: DEFAULT_AVATAR,
    typeFriendItem: "leaderboard",
    streaks: 180,
    onClick: () => console.info("Clicked friend: Do Duc Anh"),
  },
  {
    id: "2",
    name: "John Doe",
    imgUrl: "https://i.pravatar.cc/150?img=12",
    typeFriendItem: "leaderboard",
    streaks: 150,
    onClick: () => console.info("Clicked friend: John Doe"),
  },
  {
    id: "3",
    name: "Jane Smith",
    imgUrl: "https://i.pravatar.cc/150?img=5",
    typeFriendItem: "friends",
    streaks: 45,
    onClick: () => console.info("Clicked friend: Jane Smith"),
  },
  {
    id: "4",
    name: "Bob Johnson",
    imgUrl: "https://i.pravatar.cc/150?img=14",
    typeFriendItem: "request",
    onClick: () => console.info("Clicked friend: Bob Johnson"),
  },
  {
    id: "5",
    name: "Alice Williams",
    imgUrl: "https://i.pravatar.cc/150?img=32",
    typeFriendItem: "leaderboard",
    streaks: 12,
    onClick: () => console.info("Clicked friend: Alice Williams"),
  },
];

export const mockFriends: TFriendDetail[] = [
  {
    id: "1",
    imgBackground:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80",
    imgUrl: DEFAULT_AVATAR,
    name: "Do Duc Anh",
    email: "doducanh@example.com",
    phoneNumber: "0901234567",
    streak: 180,
    badges: 5,
    follower: 120,
    course: 3,
  },
  {
    id: "2",
    imgUrl: "https://i.pravatar.cc/150?img=12",
    name: "John Doe",
    email: "johndoe@example.com",
    streak: 150,
    badges: 12,
    follower: 850,
    course: 8,
  },
  {
    id: "3",
    imgBackground:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
    imgUrl: "https://i.pravatar.cc/150?img=5",
    name: "Jane Smith",
    email: "janesmith@example.com",
    phoneNumber: "0987654321",
    streak: 45,
    badges: 1,
    follower: 15,
    course: 1,
  },
  {
    id: "4",
    imgBackground:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    imgUrl: "https://i.pravatar.cc/150?img=14",
    name: "Bob Johnson",
    email: "bobjohnson@example.com",
    streak: 0,
    badges: 45,
    follower: 12500,
    course: 24,
  },
  {
    id: "5",
    imgUrl: "https://i.pravatar.cc/150?img=32",
    name: "Alice Williams",
    email: "alicewilliams@example.com",
    phoneNumber: "0912345678",
    streak: 12,
    badges: 0,
    follower: 0,
    course: 0,
  },
];
