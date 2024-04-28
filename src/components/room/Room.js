import { useEffect, useState } from "react";

export default function Room() {
	const [roomId, setRoomId] = useState(0);
	const [room, setRoom] = useState([]);
	const [toggleCreateRoom, setToggleCreateRoom] = useState(false);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		localStorage.setItem("id", JSON.stringify(room));
	}, [room]);

	const createRoom = () => {
		setToggleCreateRoom(!toggleCreateRoom);
	};

	const addRoom = () => {
		if (inputValue !== "") {
			setRoom((prev) => {
				return [...prev, { id: roomId, room: inputValue }];
			});
			setRoomId(roomId + 1);
			setInputValue("");
		}
	};

	return (
		<>
			<div className="text-center">Meeting Room List</div>
			<div className="text-center">
				<li className="list-none" key={room.id}>
					{room.map((room) => {
						return <ul key={room.id}>{room.room}</ul>;
					})}
				</li>
			</div>
			<div className="text-center">
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
		</>
	);
}
