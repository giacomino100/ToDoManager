
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isToday from 'dayjs/plugin/isToday';

import { Form, ListGroup, Button } from 'react-bootstrap/';
import { PersonSquare, PencilSquare, Trash } from 'react-bootstrap-icons';

import API from '../API'


dayjs.extend(isYesterday).extend(isToday).extend(isTomorrow);


const formatDeadline = (d) => {
  if (!d) return '--o--';
  else if (d.isToday()) {
    return d.format('[Today at] HH:mm');
  } else if (d.isTomorrow()) {
    return d.format('[Tomorrow at] HH:mm');
  } else if (d.isYesterday()) {
    return d.format('[Yesterday at] HH:mm');
  } else {
    return d.format('dddd DD MMMM YYYY [at] HH:mm');
  }
}

const TaskRowData = (props) => {
  const { task, onCheck, loggedIn} = props;
  const labelClassName = `${task.important ? 'important' : ''} ${task.completed ? 'completed' : ''}`;

  return (
    <>
      <div className="flex-fill m-auto">
        <Form.Group className="m-0" controlId="formBasicCheckbox">
          <Form.Check type="checkbox">
            {loggedIn && <Form.Check.Input type="checkbox" defaultChecked={task.completed} onChange={ (ev) => onCheck(ev.target.checked)} />}
            <Form.Check.Label className={labelClassName} >{task.description}</Form.Check.Label>
          </Form.Check>
        </Form.Group></div>
      <div className="flex-fill mx-2 m-auto"><PersonSquare className={task.private ? 'invisible' : ''} /></div>
      <div className="flex-fill m-auto"><small>{formatDeadline(task.deadline)}</small></div>
    </>
  )
}

const TaskRowControl = (props) => {
  const { onDelete, onEdit } = props;
  return (
    <>
      <div className="ml-10">
        <Button variant="link" className="shadow-none" onClick={onEdit}><PencilSquare /></Button>
        <Button variant="link" className="shadow-none" onClick={onDelete}><Trash /></Button>
      </div>
    </>
  )
}


const ContentList = (props) => {
  const { tasks, onDelete, onEdit, onCheck, loggedIn, next} = props;

  useEffect(() => {
    if (loggedIn && dirty) {
      API.getUserTasks(user.id, 1)
        .then(tasks => {
          if(activeFilter == 'all')
            setTaskList(tasks.filter(( ) => true))
          if(activeFilter == 'important')
            setTaskList(tasks.filter(t => t.important))
          if(activeFilter == 'today')
            setTaskList(tasks.filter(t => t.deadline && t.deadline.isToday()))
          if(activeFilter == 'nextweek')
            setTaskList(tasks.filter(t => isNextWeek(t.deadline)))
          if(activeFilter == 'private')
            setTaskList(tasks.filter(t => t.private))
          setDirty(false);
        })
        .catch(e => handleErrors(e));
    } 
  }, [activeFilter, dirty, loggedIn])


  return (
    <>
      <ListGroup as="ul" variant="flush">
        {
          tasks.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} className="d-flex w-100 justify-content-between">
                  <TaskRowData task={t} onCheck={ (flag) => onCheck(t, flag)} loggedIn={loggedIn}/>
                  {loggedIn ? <><TaskRowControl task={t} onDelete={() => onDelete(t)} onEdit={() => onEdit(t)} /></> : <></>}
              </ListGroup.Item>
            );
          })
        }
        <Button href={next}>Next</Button>
      </ListGroup>
    </>
  )
}

export default ContentList;