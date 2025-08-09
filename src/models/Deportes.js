import mongoose, {Schema,model} from 'mongoose'

const deporteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    horario: {
        type: String,
        required: true,
        trim: true
    },
    lugar: {
        type: String,
        required: true,
        trim: true
    },
    precioUniforme: {
        type: Number,
        required: true,
        min: 0
    },
    estadoPago: {
        type: String,
        enum: ['Pendiente', 'Pagado'],
        default: 'Pendiente'
    }
    }, {
    timestamps: true
});
export default model('Deporte', deporteSchema);
