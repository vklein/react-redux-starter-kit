import * as dataActions from "actions/data";
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ReactComponent} from "apparena-patterns-react";
import Header from "components/header";

class HomeContainer extends ReactComponent {
    render() {
        const {data} = this.props;
        return (
            <div>
                <Header data={data}/>
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