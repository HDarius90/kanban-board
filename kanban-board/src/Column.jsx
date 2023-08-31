import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Task from './Task'

export default function Column({ stateName, allTask }) {
    const cards = [];
    for (let i = 0; i < allTask.length; i++) {
        if (allTask[i].state === stateName) {
            cards.push(<Task task={allTask[i]} />)
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
                <h2 style={{
                    backgroundColor: stateName === 'todo' ? 'red' : stateName === 'inprogress' ? 'yellow' : 'green',
                    marginTop: '2rem'
                }}>
                    {stateName === 'todo' ? 'To Do' : stateName === 'inprogress' ? 'In Progress' : 'Done'}
                </h2>
            <Stack spacing={3}>
                {cards}
            </Stack>
        </Box >
    );
}