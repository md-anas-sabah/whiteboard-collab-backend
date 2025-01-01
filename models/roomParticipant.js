module.exports = (sequelize, DataTypes) => {
  const RoomParticipant = sequelize.define("RoomParticipant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });
  return RoomParticipant;
};
