import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



export default function Task({ task }) {
    return (
        <Card sx={{
            minWidth: 275,
            backgroundColor: task.priority === "low" ? "#bde0fe" : task.priority === "medium" ? "#f2e682" : "#ec8796",
            margin: '2rem',
            cursor: 'move',
            transitionDuration: '0.4s'
        }}
            title={task.deadline}
        >
            <CardContent>
                <Typography sx={{ fontSize: 13 }} color="text.secondary">
                    {task.deadline}
                </Typography>
                <Typography variant="h5" component="div">
                    {task.text}
                </Typography>
            </CardContent>
            <CardActions sx={{
                justifyContent: 'space-between'

            }}>
                <Button size="small"><SettingsIcon /></Button>
                <Button size="small"><ArrowBackIosIcon /></Button>
                <Button size="small"><ArrowForwardIosIcon /></Button>
                <Button size="small"><DeleteIcon /></Button>
            </CardActions>
        </Card >
    );
}

