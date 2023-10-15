import React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";

import { Link } from "react-router-dom";
import Products from "../../Pages/Products/Products";
import Categories from "../../Pages/Categories/Categories";

import Orders from "../../Pages/Orders/Orders";
import Account from "../../Pages/Account/Account";
import NewAdmin from "../../Pages/NewAdmin/NewAdmin";
import PedidoPersonal from "../../Pages/Personal_orders/personal_order";
import PedidoOnline from "../../Pages/PedidoOnline/PedidoOnline";
import PedidoNormal from "../../Pages/PedidoNormal/PedidoNormal";

const categories = [
  {
    id: "Options:",
    children: [
      {
        id: "Orders",
        icon: <SellIcon />,
        route: <Orders />,
        tittle: "Manage Orders",
      },
      {
        id: "Products",
        icon: <InventoryIcon />,
        route: <Products />,
        tittle: "Manage Products",
      },
      {
        id: "Categories",
        icon: <CategoryIcon />,
        route: <Categories />,
        tittle: "Manage Categories",
      },
      {
        id: "Personal Orders",
        icon: <ShoppingCartIcon />,
        route: <PedidoPersonal />,
        tittle: "Manage Personal Orders",
      },
      {
        id: "Online Orders",
        icon: <ShoppingCartIcon />,
        route: <PedidoOnline />,
        tittle: "Manage Online Orders",
      },
      {
        id: "Common Orders",
        icon: <ShoppingCartIcon />,
        route: <PedidoNormal />,
        tittle: "Manage Common Orders",
      },
    ],
  },
  {
    id: "Users",
    children: [
      {
        id: "My Account",
        icon: <AccountCircleIcon />,
        route: <Account />,
        tittle: "My Account",
      },
      {
        id: "New Admin",
        icon: <PersonAddIcon />,
        route: <NewAdmin />,
        tittle: "New Admin",
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { navigatorOptions1 } = props;

  const handleOptions = (data) => {
    props.onSaveRoute(data);
  };

  const handleNavigatorOptions = (route, title) => {
    // Llama a la función navigatorOptions pasando los parámetros
    navigatorOptions1(route, title);
  };

  return (
    <Drawer variant="permanent" {...props}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          VeroCamShop
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, route, tittle }) => (
              <ListItem disablePadding key={childId}>
                <button
                  onClick={() => handleNavigatorOptions(route, tittle)}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  <ListItemButton selected={active} sx={item}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </button>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
