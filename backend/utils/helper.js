const db = require('../models');

const userNamesDict = {}

async function getUserNameById(id) {
  if (id == null) {
    return "";
  } else if (userNamesDict[id] != null) {
    return userNamesDict[id]
  } else {
    const tempUser = await db.User.findByPk(id);
    userNamesDict[id] = tempUser.name;
    return tempUser.name
  }
}

const groupNamesDict = {}

async function getGroupNameById(id) {
  if (id == null) {
    return "";
  } else if (groupNamesDict[id] != null) {
    return groupNamesDict[id]
  } else {
    const tempUser = await db.Group.findByPk(id);
    groupNamesDict[id] = tempUser.name;
    return tempUser.name
  }
}

module.exports = {
    settleUpTheUsers: async (rawDebt) => {
        // find paidBy userId and paidTo userId
        const [toBepaidByUserId, toBepaidToUserId] =
          rawDebt.amount < 0
            ? [rawDebt.userId1, rawDebt.userId2]
            : [rawDebt.userId2, rawDebt.userId1];
    
        // find amount to be paid
        const amountToBePaid =
          rawDebt.amount < 0 ? -1 * rawDebt.amount : rawDebt.amount;
    

          const authorName = await getUserNameById(toBepaidByUserId);
          const otherName = await getUserNameById(toBepaidToUserId);
          const groupName = await getUserNameById(toBepaidByUserId);

        // Add expense
        const expense = await db.History.create(
          {
            title:authorName + " settled balance with " + otherName, //
            amount: amountToBePaid,
            groupId: rawDebt.groupId,
            author: toBepaidByUserId,
            authorName: authorName,
            groupName: groupName
          },
        );
    
        // Update Group Balances
        const groupBalanceOfPayer = await db.GroupBalance.findOne({
          where: {
            userId: toBepaidByUserId,
            groupId: rawDebt.groupId
          },
        });
        const groupBalanceOfPayee = await db.GroupBalance.findOne({
          where: {
            userId: toBepaidToUserId,
            groupId: rawDebt.groupId
          },
        });
    
        groupBalanceOfPayer.balance = groupBalanceOfPayer.balance + amountToBePaid;
        groupBalanceOfPayee.balance = groupBalanceOfPayee.balance - amountToBePaid;
        await groupBalanceOfPayer.save();
        await groupBalanceOfPayee.save();
    
        // Add activities for Settling Up
    
        // Get most recent activity of payer
        // const recentActivityOfPayer = await models.activities.findOne({
        //   order: [["createdAt", "DESC"]],
        //   where: {
        //     currencyId: rawDebt.currencyId,
        //     userId: toBepaidByUserId,
        //   },
        // });
        // // Get most recent activity of Payee
        // const recentActivityOfPayee = await models.activities.findOne({
        //   order: [["createdAt", "DESC"]],
        //   where: {
        //     currencyId: rawDebt.currencyId,
        //     userId: toBepaidToUserId,
        //   },
        // });
        // // Get most recent group activity of Payer
        // const recentGroupActivityOfPayer = await models.activities.findOne({
        //   order: [["createdAt", "DESC"]],
        //   where: {
        //     currencyId: rawDebt.currencyId,
        //     userId: toBepaidByUserId,
        //   },
        //   include: [
        //     {
        //       model: models.expenses,
        //       attributes: ["id", "groupId"],
        //       where: {
        //         id: {
        //           [Op.ne]: expense.id,
        //         },
        //         groupId: rawDebt.groupId,
        //       },
        //       required: true,
        //     },
        //   ],
        // });
        // // Get most recent group activity of Payee
        // const recentGroupActivityOfPayee = await models.activities.findOne({
        //   order: [["createdAt", "DESC"]],
        //   where: {
        //     currencyId: rawDebt.currencyId,
        //     userId: toBepaidToUserId,
        //   },
        //   include: [
        //     {
        //       model: models.expenses,
        //       attributes: ["id", "groupId"],
        //       where: {
        //         id: {
        //           [Op.ne]: expense.id,
        //         },
        //         groupId: rawDebt.groupId,
        //       },
        //       required: true,
        //     },
        //   ],
        // });
    
        // Create new activity for payer
        await db.Transaction.create(
          {
            author: toBepaidByUserId,
            borrowerId: toBepaidToUserId,
            authorName: authorName,
            borrowerName: otherName,
            groupName: groupName,
            groupId: rawDebt.groupId,
            title: "Settle balance",
            amount: amountToBePaid,
            currency: "USD",
            settled: 1
          }
        );
    
        // Create new activity for payee
        // await models.activities.create(
        //   {
        //     userId: toBepaidToUserId,
        //     currencyId: rawDebt.currencyId,
        //     expenseId: expense.id,
        //     totalBalance: recentActivityOfPayee.totalBalance - amountToBePaid,
        //     groupBalance: recentGroupActivityOfPayee.groupBalance - amountToBePaid,
        //     expenseBalance: 0,
        //   },
        // );
    
        // Set debt amount to zero
        rawDebt.amount = 0;
        await rawDebt.save();
      },
}