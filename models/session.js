module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sessionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Session;
};
