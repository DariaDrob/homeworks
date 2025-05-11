import styled from 'styled-components';

const StyledLi = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  color: ${props => (props.isImportant ? 'red' : 'black')};
`;

const StyledButton = styled.button`
  margin-left: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: #c82333;
  }
`;

function TaskItem({ task, isImportant, onDelete }) {
    return (
        <StyledLi isImportant={isImportant}>
            {task}
            {isImportant && ' (Важливе)'}
            <StyledButton onClick={onDelete}>Видалити</StyledButton>
        </StyledLi>
    );
}

export default TaskItem;