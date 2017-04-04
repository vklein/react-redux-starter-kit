import * as dataActions from "actions/data";
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ReactComponent, Button} from "apparena-patterns-react";
import {Link} from "react-router";

class HomeContainer extends ReactComponent {
    getInitState() {
        return {
            data: {}
        };
    }

    render() {
        const {data} = this.props;
        return (
            <div>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="form">Form</Link>
                </div>
                {this.props.children}
                <div>
                    <Button type="primary">
                        Test
                    </Button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        data: state.data,
    }),
    (dispatch) => ({
        ...bindActionCreators(dataActions, dispatch),
    })
)(HomeContainer);