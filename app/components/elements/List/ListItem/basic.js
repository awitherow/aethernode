import React, { PropTypes } from 'react';
import './list-item.css';
import classnames from 'classnames';

const Basic = ({ item, edit }) => (
    <li>
        <span
            className={classnames('title', {
                'high-prio': item.prio === 3,
                'med-prio': item.prio === 2,
                'low-prio': item.prio === 1,
            })}
        >
            {item.content}
        </span>
        <button onClick={() => edit(item.id)}>✎</button>
    </li>
);

Basic.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        prio: PropTypes.number.isRequired,
    }).isRequired,
    edit: PropTypes.func.isRequired,
};

export default Basic;
