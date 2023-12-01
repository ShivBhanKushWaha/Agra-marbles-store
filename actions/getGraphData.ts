import moment from "moment";
import prisma from "@/libs/prismadb"

export default async function getGraphData() {
    try{
        // get data from last 7 days
        const startDate = moment().subtract(6,"days").startOf('day');
        const endData = moment().endOf("day")

        const result = await prisma?.order.groupBy({
            by:["createdDate"],
            where:{
                createdDate:{
                    gte:startDate.toISOString(),
                    lte:endData.toISOString(),
                },
                status:"complete",
            },
            _sum:{
                amount: true,
            },
        });

        // initilize the data by day
        const aggregatedData:{
            [day: string] : {day: string; date: string; totalAmount : number};
        } = {};

        // create clone data to iterate each day
        const currentDate = startDate.clone();

        while(currentDate <= endData){
            // format as a string"monday"
            const day = currentDate.format("dddd");

            aggregatedData[day] = {
                day,
                date:currentDate.format("YYYY-MM-DD"),
                totalAmount: 0
            };

            // move to next day
            currentDate.add(1, "day")
        }

        // calculate the total amount for each day by summing the order amounts
        result.forEach((entry) => {
            const day = moment(entry.createdDate).format("dddd");
            const amount = entry._sum.amount || 0;
            aggregatedData[day].totalAmount += amount;
        });

        // convert the aggregatedData objectto array and sort it by date
        const formattedData = Object.values(aggregatedData).sort((a,b) =>
            moment(a.date).diff(moment(b.date))
        );

        // return the formated data
        return formattedData;
    }
    catch(error: any){
        throw new Error(error)
    }
    
}