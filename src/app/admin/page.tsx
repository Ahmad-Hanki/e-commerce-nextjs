import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/prisma";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: {
      pricePaidInCents: true, // sum of pricePaidInCents
    },
    _count: true, // how many rows
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, Average] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        pricePaidInCents: true,
      },
    }),
  ]);

  // same as:
  // const userCount = await prisma.user.count(); //  just gives the count same as above
  // const Average = await prisma.order.aggregate({
  //     _sum: {
  //         pricePaidInCents:true
  //     }
  // })

  return {
    userCount,
    AveragePerUser:
      userCount == 0
        ? 0
        : (Average._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

const getProductData = async () => {
  const [active, inActive] = await Promise.all([
    prisma.product.count({
      where: {
        isAvailableForpurchase: true,
      },
    }),
    prisma.product.count({
      where: {
        isAvailableForpurchase: false,
      },
    }),
  ]);

  return {
    active,
    inActive,
  };
  }


const AdminDashboard = async () => {
  const [{ amount, numberOfSales }, { AveragePerUser, userCount }, {active, inActive}] =
    await Promise.all([getSalesData(), getUserData(), getProductData()]);

  // same as:
  //   const { amount, numberOfSales } = await    getSalesData();
  //   const { userCount, AveragePerUser } = await    getUserData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(numberOfSales)} Orders`}
        body={formatCurrency(amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(AveragePerUser)} Average Value`}
        body={formatNumber(userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(inActive)} Inactive Products`}
        body={formatNumber(active)}
      />
    </div>
  );
};

export default AdminDashboard;

interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{body}</p>
        </CardContent>
      </Card>
    </div>
  );
}
