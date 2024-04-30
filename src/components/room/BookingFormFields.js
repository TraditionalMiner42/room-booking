import React from "react";

const FormField = ({ label, name, type, placeholder, value, onChange }) => (
	<div className="form-item">
		<div className="form-detail">
			<label>{label}</label>
			<input
				type={type}
				name={name}
				placeholder={placeholder || ""} // Optional placeholder
				value={value}
				onChange={onChange}
			/>
		</div>
	</div>
);

export default FormField;
