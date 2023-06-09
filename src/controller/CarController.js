import Car from '../models/Car';
import Category from '../models/Category'

class CarController {

    async store(req, res){
        const category = await Category.findOne({
            where: {
                id: req.body.category_id
            }
        });

        if(!category){
            return res.status(400).json({ error: "Car needs a valid category" });
        }

        const new_car = await Car.create(req.body);

        return res.json(new_car);
    }

    async index(req, res){
        const { category_id } = req.params;

        if(category_id){
            const cars = await Car.findAll({
                where: {
                    category_id
                },
                include: [
                    {
                        model: Category,
                        as: 'category'
                    }
                ]
            });

            return res.json(cars);
        }else {
            const cars = await Car.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category'
                    }
                ]
            });

            return res.json(cars);
        }
    }

    async show(req, res){
        const { id } = req.params;

        const car = await Car.findOne({
            where: { id },
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });

        return res.json(car);
    }

    async current_on_track(req, res){
        const car = await Car.findOne({
            where:{
                on_track: true
            },
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });

        return res.json(car);
    }

}

export default new CarController();
