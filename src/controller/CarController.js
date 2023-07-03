import Car from '../models/Car';
import Category from '../models/Category'
import Timeboard from '../models/Timeboard';
import Laptime from '../models/Laptime';
import Championship from '../models/Championship';

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
        if(car){
            const timeboard = await Timeboard.findOne({
                where:{
                    car_id: car.id,
                    finished_round: false
                },
                include: [
                    {
                        model: Car,
                        as: 'car'
                    },
                    {
                        model: Laptime,
                        as: 'laptime'
                    },
                    {
                        model: Championship,
                        as: 'championship'
                    }
                ]
            })

            return res.json({
                id: timeboard.id,
                round_number: timeboard.round_number,
                best_time: timeboard.best_time,
                finished_round: timeboard.finished_round,
                car_id: timeboard.car_id,
                laptime_id: timeboard.laptime_id,
                championship_id: timeboard.championship_id,
                car: timeboard.car,
                laptime: [ timeboard.laptime.lap_1, timeboard.laptime.lap_2, timeboard.laptime.lap_3, timeboard.laptime.lap_4, timeboard.laptime.lap_5 ],
                championship: timeboard.championship
            });
        }else {
            return res.json(null)
        }
    }

}

export default new CarController();
