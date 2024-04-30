import { useEffect, useState } from "react";
import BookingForm from "./BookingForm";

export default function Room() {
	const [roomId, setRoomId] = useState(0);
	const [room, setRoom] = useState([]);
	const [toggleCreateRoom, setToggleCreateRoom] = useState(false);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const data = window.localStorage.getItem("room");
		// console.log("room: ", room);
		setRoom(JSON.parse(data));
	}, []);

	const createRoom = () => {
		setToggleCreateRoom(!toggleCreateRoom);
	};

	const addRoom = () => {
		if (inputValue !== "") {
			setRoom((prev) => {
				prev = prev || [];
				const newRoom = [...prev, { id: roomId, room: inputValue }];
				window.localStorage.setItem("room", JSON.stringify(newRoom)); // Update localStorage with the new value
				return newRoom; // Update the state with the new value
			});
			setRoomId(roomId + 1);
			setInputValue("");
		}
	};

	return (
		<>
			{console.log("room: ", room)}
			<div className="text-center">Meeting Room List</div>

			<div className="flex flex-row justify-center">
				<div>
					<li className="list-none" key={room?.id}>
						{room?.map((room) => {
							return <ul key={room?.id}>{room.room}</ul>;
						})}
					</li>
				</div>
				<div>
					{toggleCreateRoom ? (
						<div>
							<input
								className="border"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
							/>
							<button className="border" onClick={addRoom}>
								Add room
							</button>
						</div>
					) : (
						<button className="border" onClick={createRoom}>
							Create more room
						</button>
					)}
				</div>
			</div>
			<div>
				<BookingForm room={room} />
			</div>
		</>
	);
}
