import React, {PropTypes} from "react";
import {Form as FormContainer, FormGroup, Input} from "apparena-patterns-react";
import styles from "./index.scss";

function Form({data, handleInputChange}) {
    return (
        <div className={styles.header}>
            <FormContainer >
                <FormGroup label="Name">
                    <Input
                        onChange={handleInputChange}
                        defaultValue={data.name}
                        name="name"
                    />
                </FormGroup>
            </FormContainer>
        </div>
    )
}

Form.propTypes = {
    data: PropTypes.object.isRequired,
    handleInputChange: PropTypes.func.isRequired,
};

export default Form;
