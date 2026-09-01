import { useParams } from 'react-router-dom';

export function UserEditPage() {
    const { id } = useParams();

    return (
        <div>
            <h2>Editar usuário</h2>

            <p>ID: {id}</p>
        </div>
    );
}